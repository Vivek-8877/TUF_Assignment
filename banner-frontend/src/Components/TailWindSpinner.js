// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';

const TailwindSpinner = ({ loadingText, successTitle, successMessage, errorTitle, errorMessage, status, onClose }) => {
  // Inline CSS for custom animations
  const spinnerStyles = `
    @keyframes spinColor {
      0% { stroke: #22C55E; }    /* Start with green */
      25% { stroke: #3B82F6; }   /* Change to blue */
      50% { stroke: #F59E0B; }   /* Change to yellow */
      75% { stroke: #EF4444; }   /* Change to red */
      100% { stroke: #22C55E; }  /* Back to green */
    }
    .spinner {
      animation: spin 3s linear infinite, spinColor 4s linear infinite;
    }
    @keyframes spin {
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-75">
      <style>{spinnerStyles}</style> {/* Inject the custom CSS */}
      <div className="flex flex-col items-center">
        {status === 'loading' && (
          <div role="status" className="flex flex-col items-center">
            <svg
              aria-hidden="true"
              className="inline w-24 h-24 spinner"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
            <span className="mt-4 text-white text-lg">{loadingText}</span>
          </div>
        )}
        {(status === 'success' || status === 'error') && (
          <div className="flex flex-col items-center">
            {status === 'success' ? (
              <>
                <svg
                  className="w-24 h-24 text-green-500 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2l4-4"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 22C17.523 22 22 17.523 22 12S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10z"
                  ></path>
                </svg>
                <h2 className="text-2xl font-bold text-white">{successTitle}</h2>
                <p className="text-lg text-white">{successMessage}</p>
              </>
            ) : (
              <>
                <svg
                  className="w-24 h-24 text-red-500 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v6m0 4h.01M4.93 4.93l14.14 14.14"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 22C17.523 22 22 17.523 22 12S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
                  />
                </svg>
                <h2 className="text-2xl font-bold text-white">{errorTitle}</h2>
                <p className="text-lg text-white">{errorMessage}</p>
              </>
            )}
            <button
              onClick={onClose}
              className="mt-6 px-4 py-2 bg-white text-gray-700 font-bold rounded hover:bg-gray-100"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

TailwindSpinner.propTypes = {
  loadingText: PropTypes.string.isRequired,
  successTitle: PropTypes.string.isRequired,
  successMessage: PropTypes.string.isRequired,
  errorTitle: PropTypes.string,
  errorMessage: PropTypes.string,
  status: PropTypes.oneOf(['loading', 'success', 'error']).isRequired,
  onClose: PropTypes.func.isRequired, // Add onClose as a required prop
};

export default TailwindSpinner;
