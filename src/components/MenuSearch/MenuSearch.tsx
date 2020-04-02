import React from "react";

interface Props {
  mediaModules: {};
  setMediaModules: React.Dispatch<React.SetStateAction<{}>>;
}

const MenuSearch = ({ mediaModules, setMediaModules }: Props) => {
  return(
    <section>
      <input id="youtube" type="checkbox"/>
      <label htmlFor="youtube">youtube</label>
      <input id="facebook" type="checkbox"/>
      <label htmlFor="facebook">facebook</label>
      <input id="instagram" type="checkbox"/>
      <label htmlFor="instagram">instagram</label>
      <input id="twitter" type="checkbox"/>
      <label htmlFor="twitter">twitter</label>
      <input id="web" type="checkbox"/>
      <label htmlFor="web">web</label>
    </section>
  );
}

export default MenuSearch;