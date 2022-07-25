export const formatFromSeconds = (defaultNumber: number, asString: boolean) => {
  const days = Math.floor(defaultNumber / 86400);
  const hours = Math.floor((defaultNumber - days * 86400) / 3600);
  const minutes = Math.floor(
    (defaultNumber - days * 86400 - hours * 3600) / 60
  );

  if (asString) {
    return `${days} ${hours}:${minutes}`;
  }

  return [minutes, hours, days];
};
