const SubmitBtn = ({ name, isValid, isSubmitSuccessful, isSubmitting }) => {
  // console.log(isSubmitting);
  return (
    <>
      {/* {isValid || (
        <button
          disabled={isSubmitSuccessful}
          type="submit"
          className="btn mt-5 w-full text-white border-none bg-secondary-light"
        >
          {isSubmitting && (
            <span className="loading-spinner text-red-600 loading-sm"></span>
          )}
          {name}
        </button>
      )}


      {isValid && (
        <button
          disabled={isSubmitSuccessful || !isValid}
          type="submit"
          className="btn mt-5 w-full text-white border-none bg-secondary-light"
        >
          {isSubmitting && (
            <span className="loading-spinner text-red-600 loading-sm"></span>
          )}
          {isSubmitting || name}
        </button>
      )} */}
      
        <button
          disabled={isSubmitting}
          type="submit"
          className="btn mt-5 w-full text-white border-none bg-primary-light"
        >
          {isSubmitting && (
            <span className="loading-spinner text-red-600 loading-sm"></span>
          )}
          {isSubmitting || name}
        </button>
      
    </>
  );
};

export default SubmitBtn;
