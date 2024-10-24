const url = () => {
    return `${process.env.DB_HOST}:${process.env.DB_PORT}/Valkyrie`;
  };
  
  export default url;
  