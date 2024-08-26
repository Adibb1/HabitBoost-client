import Image from "next/image";

function LogoLink() {
  return (
    <div className="mb-4 text-center sm:mb-0">
      <Image
        src={`http://localhost:5000/logo.png`}
        alt="logo"
        width={40}
        height={40}
        className="object-contain"
      />
    </div>
  );
}

export default LogoLink;
