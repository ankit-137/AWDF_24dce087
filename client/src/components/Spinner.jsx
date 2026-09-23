function Spinner({ message = 'Loading...' }) {
  return (
    <div className="spinner-wrap">
      <div className="spinner" role="status" aria-label="Loading" />
      <p>{message}</p>
    </div>
  );
}

export default Spinner;
