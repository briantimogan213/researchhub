export const IDRegExFormat = {
  studentId: new RegExp("^20\\d{7}$"),
  studentName: new RegExp("^[A-ZÑ]+(?: [A-ZÑ]+)*?(?: [A-ZÑ]\\. )?(?:[A-ZÑ]+(?: [A-ZÑ]+)*)?(?: (?:III|IV|V|VI|VII|VIII|IX|X))?$"),
  fullStudentID: new RegExp(
    "^[A-ZÑ]+(?: [A-ZÑ]+)*?(?: [A-ZÑ]\\. )?(?:[A-ZÑ]+(?: [A-ZÑ]+)*)?(?: (?:III|IV|V|VI|VII|VIII|IX|X))?$\\r?\\n^20\\d{7}$"
  )
}
