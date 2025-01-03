import React from "react";

const Mailing = () => {
  return (
    <div className="bg-gradient-to-t to-[rgb(183,67,88)] text-center from-[rgb(242,75,105)] rounded-xl text-white py-8 md:py-12 my-8">
      <p className="text-2xl md:text-4xl font-semibold">Join Our Mailing List</p>
      <p className="my-6 md:my-4 text-sm md:text-base">
        Subscribe to our mailing list to receive exclusive updates, special
        offers, and the latest news about our brain games app.
      </p>
      <div className="flex flex-row justify-center mx-4 text-xs">
        <input
          type="email"
          placeholder="Your email address"
          className="rounded-l-lg px-2 md:px-4 md:py-4 w-full text-gray-600 md:max-w-[30vw]"
        />
        <button className="bg-[rgb(242,159,5)] rounded-r-lg px-6 py-4 font-semibold">Subscribe</button>
      </div>
    </div>
  );
};

export default Mailing;


// import React from "react";

// const Mailing = () => {
//   return (
//     <div className="bg-gradient-to-t to-[rgb(183,67,88)] text-center from-[rgb(242,75,105)] rounded-xl text-white py-12 my-8">
//       <p className="text-3xl md:text-4xl font-semibold">Join Our Mailing List</p>
//       <p className="my-4 text-sm md:text-base">
//         Subscribe to our mailing list to receive exclusive updates, special
//         offers, and the latest news about our brain games app.
//       </p>
//       <div className="flex flex-col sm:flex-row justify-center mx-auto space-y-4 sm:space-y-0">
//         <input
//           type="email"
//           placeholder="Your email address"
//           className="rounded-l-lg px-4 py-4 w-full max-w-[90%] sm:max-w-[30vw]"
//         />
//         <button className="bg-[rgb(242,159,5)] rounded-r-lg px-6 py-4 w-full sm:w-auto">
//           Subscribe
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Mailing;
