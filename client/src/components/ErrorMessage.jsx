function ErrorMessage({ message }) {
  return (
    <div className="error-box">
      <p className="error-msg">Error: {message}</p>
    </div>
  );
}

export default ErrorMessage;
