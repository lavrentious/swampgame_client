import React from "react";

const ListContext = React.createContext<{ flush: boolean }>({
  flush: false,
});

export default ListContext;
