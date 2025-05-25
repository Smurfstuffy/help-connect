const HelpRequestStatus = ({isClosed}: {isClosed: boolean}) => {
  return (
    <div
      className={`rounded-lg px-3 py-1 text-sm ${
        isClosed
          ? 'bg-red-100 text-red-700 border border-red-300'
          : 'bg-green-100 text-green-700 border border-green-300'
      }`}
    >
      {isClosed ? 'Closed' : 'Actual'}
    </div>
  );
};

export default HelpRequestStatus;
