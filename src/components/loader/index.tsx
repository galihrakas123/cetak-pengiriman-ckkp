import React from "react";

const Loader: React.FC = () => {
  return (
    <section className="relative text-center mx-auto flex justify-center h-full w-full">
      <img
        src="/images/loader-bapenda.png"
        alt="banner-login"
        className="rotate mt-10"
      />
      {/* <Lottie animationData={animation} loop width={300} height={300} /> */}
    </section>
  );
};

export default Loader;
