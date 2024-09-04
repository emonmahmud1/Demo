const TicketCard = ({ count, type, progress, icon }) => {
  return (
    <div className="card bg-base-100 w-full shadow-xl">
      <div className="card-body">
        <div className="flex justify-between">
          <h2 className="card-title font-bold text-2xl">888</h2>
          {/* <button className="btn btn-primary">Buy Now</button> */}
        </div>
        <div>
          <p className="text-gray-gray4">open Ticket</p>
        </div>
        <div className="">
          <progress
            class="progress progress-secondary w-56"
            value="70"
            max="100"
          />
          70%
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
