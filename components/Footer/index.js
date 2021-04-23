import React from "react";

const Footer = () => {
  return (
    <div className="bg-gray-700 p-4 ">
      <div className="container mx-auto text-center font-bold text-white">
        Projeto desenvolvido por: Wagner Duarte /{" "}
        <a className="hover:underline" href="https://github.com"> Linkedin </a> /{" "}
        <a className="hover:underline" href="https://github.com"> Github </a>
        <div className="mt-2">
          <img className="inline p-4" src="/semana.png" />
          <img className="inline p-4" src="/devpleno.png" />
        </div>
      </div>
    </div>
  );
};

export default Footer;
