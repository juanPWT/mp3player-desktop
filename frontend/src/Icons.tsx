import { useEffect, useRef } from "react";
import feather from "feather-icons";

type IconParams = {
  name: keyof typeof feather.icons; // Membatasi hanya ke nama ikon yang valid
  size?: number;
  color?: string;
};

const Icon: React.FC<IconParams> = ({ name, size = 24, color = "#8a2be2" }) => {
  const iconRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (iconRef.current) {
      iconRef.current.innerHTML = feather.icons[name].toSvg({ width: size, height: size, stroke: color });
    }
  }, [name, size, color]);

  return <span ref={iconRef} />;
};

export default Icon;

