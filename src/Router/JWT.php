<?php

declare(strict_types=1);

namespace Smcc\ResearchHub\Router;

class JWT
{
  private static $algo = 'sha256';

  /**
   * Encode (create) a JWT.
   *
   * @param array $header Associative array representing the JWT header.
   * @param array $payload Associative array representing the JWT payload.
   * @return string The encoded JWT.
   */
  public static function encode(array $payload, ?string $algo = "HS256"): string
  {
    $header = [
      'alg' => $algo,
      'typ' => 'JWT',
    ];
    $cookie_session = Cookies::get('session_id');
    $finalPayload = [
      "id" => $cookie_session,
      "iat" => time(),
      "exp" => time() + 60 * 60 * 8, // 8 hours
      "data" => $payload,
    ];
    $headerEncoded = self::base64UrlEncode(json_encode($header));
    $payloadEncoded = self::base64UrlEncode(json_encode($finalPayload));
    $signature = self::base64UrlEncode(self::sign("$headerEncoded.$payloadEncoded"));

    return "$headerEncoded.$payloadEncoded.$signature";
  }

  /**
   * Decode (extract) the payload from a JWT.
   *
   * @param string $jwt The JWT string.
   * @return array|null The decoded payload or null if invalid.
   */
  public static function decode($jwt): ?array
  {
    [$headerEncoded, $payloadEncoded, $signature] = explode('.', $jwt);

    // Verify the JWT
    if (!self::verify("$headerEncoded.$payloadEncoded", $signature)) {
      return null;
    }

    // Decode the payload from Base64Url
    $decodedPayload = self::base64UrlDecode($payloadEncoded);

    return json_decode($decodedPayload, true);
  }

  /**
   * Verify a JWT.
   *
   * @param string $data The data to be signed (header and payload).
   * @param string $signature The JWT signature.
   * @return bool True if the signature is valid, false otherwise.
   */
  public static function verify($data, $signature): bool
  {
    $expectedSignature = self::base64UrlEncode(self::sign($data));
    return hash_equals($expectedSignature, $signature);
  }

  /**
   * Sign data using HMAC with the specified algorithm.
   *
   * @param string $data The data to be signed.
   * @return string The HMAC signature.
   */
  private static function sign($data): string
  {
    return hash_hmac(self::$algo, $data, JWT_SECRET_KEY, true);
  }

  /**
   * Encode data to Base64Url format.
   *
   * @param string $data The data to be encoded.
   * @return string The Base64Url encoded data.
   */
  private static function base64UrlEncode($data): string
  {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
  }

  /**
   * Decode data from Base64Url format.
   *
   * @param string $data The Base64Url encoded data.
   * @return string The decoded data.
   */
  private static function base64UrlDecode($data): string
  {
    $data = strtr($data, '-_', '+/');
    $data = str_pad($data, strlen($data) % 4, '=', STR_PAD_RIGHT);

    return base64_decode($data);
  }
}
