import React, { FC, MouseEventHandler } from "react";

const Button: FC<{
  disabled?: boolean;
  loading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}> = ({ disabled, loading, onClick, children }) => {
  return (
    <>
      <style jsx>{`
        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .button {
          position: relative;
          color: #fff;
          text-shadow: none;
          box-shadow: 0 0 0 0 rgba(34, 36, 38, 0.15) inset;
          cursor: ${disabled ? "default" : "pointer"};
          display: inline-block;
          min-height: 1em;
          outline: 0;
          border: none;
          vertical-align: baseline;
          font-family: Lato, "Helvetica Neue", Arial, Helvetica, sans-serif;
          margin: 0 0.25em 0 0;
          padding: 0.8rem 1.3rem;
          text-transform: none;
          text-shadow: none;
          font-size: 1rem;
          font-weight: 600;
          line-height: 1em;
          font-style: normal;
          text-align: center;
          text-decoration: none;
          border-radius: 0.3rem;
          transition: opacity 0.1s ease, background-color 0.1s ease,
            color 0.1s ease, box-shadow 0.1s ease, background 0.1s ease,
            -webkit-box-shadow 0.1s ease;
        }
        .button:not(:hover) {
          background-color: ${disabled ? "grey" : "#1678c2"};
        }
        .button:hover {
          background-color: ${disabled ? "grey" : "#2185d0"};
        }
        .button-loading {
          cursor: default;
        }

        .loading-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
        }
        .loading {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 7px solid transparent;
          border-top-color: rgba(0, 0, 0, 0.6);
          animation: rotate 800ms linear infinite;
        }
      `}</style>

      <button
        className={`button ${loading ? "button-loading" : ""}`}
        onClick={loading ? undefined : onClick}
      >
        {loading && (
          <div className="loading-wrapper">
            <div className="loading"></div>
          </div>
        )}
        <div style={loading ? { visibility: "hidden" } : {}}>{children}</div>
      </button>
    </>
  );
};
export default Button;
