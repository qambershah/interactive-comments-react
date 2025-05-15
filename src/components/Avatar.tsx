export function Avatar({ src, size = 40 }: { src: string; size?: number }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}${src.replace(/^\//, '')}`} // ensures leading slash is stripped
      alt="avatar"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        objectFit: 'cover',
      }}
    />
  );
}
