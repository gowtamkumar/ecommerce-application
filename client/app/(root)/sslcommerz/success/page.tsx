export default function Success() {
// const params = useParams()

// console.log("params", params);


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-2xl p-6 text-center">
        <div className="flex justify-center">
          <svg
            className="w-16 h-16 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mt-4">
          Payment Successful!
        </h2>
        <p className="text-gray-600 mt-2">
          Thank you for your purchase. Your transaction was successful.
        </p>
        {/* <p className="text-sm text-gray-500 mt-1">
            Transaction ID:{" "}
            <span className="font-medium text-gray-700">#{params.tran_id}</span>
          </p> */}

        
      </div>
    </div>
  );
}
