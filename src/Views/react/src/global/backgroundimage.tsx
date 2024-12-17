import { React, pathname } from '../imports';

export default function useBackgroundImage(src: string = "/smcc-bg.jpg") {
  const bgurl = (new URL(pathname(src), window.location.origin)).toString()
  React.useEffect(() => {
    const head = document.head
    const style = document.createElement('style');
    // backgroundImage: `url('${bgurl}')`,
    //   backgroundSize: 'cover',
    //   backgroundPosition: 'center',
    //   backgroundRepeat: 'no-repeat',
    style.innerHTML = `body { background-image: url('${bgurl}'); background-size: cover; background-position: center; background-repeat: no-repeat; }`;
    head.appendChild(style);
    return () => {
      head.removeChild(style);
    }
  }, [bgurl]);
}
