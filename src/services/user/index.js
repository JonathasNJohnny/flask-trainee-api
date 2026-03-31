export const register = (userData, query) => {
  const processedData = {
    name: userData.name,
    email: userData.email,
    password: userData.password,
  };
  const fakeResponse = `Seja bem vindo ${processedData.name.split(" ")[0]}! Seu email ${processedData.email} foi registrado com sucesso.`;
  return fakeResponse;
};
