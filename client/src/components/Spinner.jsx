function Spinner() {
  return (
    <div className="spinner-wrap">
      <div className="spinner" role="status" aria-label="Loading" />
      <p>Fetching repositories…</p>
    </div>
  );
}

export default Spinner;
