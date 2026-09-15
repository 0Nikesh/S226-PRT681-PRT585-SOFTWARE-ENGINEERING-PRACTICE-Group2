export default function DestinationCard({ destination }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">

      <img
        src={destination.image}
        alt={destination.name}
        className="h-52 w-full object-cover"
      />

      <div className="p-4">

        <p className="text-xs text-sky-600">
          {destination.country}
        </p>

        <h3 className="mt-2 text-xl font-semibold">
          {destination.name}
        </h3>

        <p className="mt-2">
          ★ {destination.rating}
        </p>

        <p className="mt-3 font-bold">
          ${destination.price}
        </p>

      </div>

    </div>
  );
}

// export default function DestinationCard({ destination }) {
//   return (
//     <div className="overflow-hidden rounded-xl bg-white shadow">

//       <div className="h-48 bg-gray-200">
//         <img
//           src={destination.image_url || "/images/destination-placeholder.jpg"}
//           alt={destination.destination_name}
//           className="h-full w-full object-cover"
//         />
//       </div>

//       <div className="p-4">

//         <p className="text-sm text-sky-600">
//           {destination.country}
//         </p>

//         <h2 className="mt-1 text-xl font-semibold">
//           {destination.destination_name}
//         </h2>

//         <p className="mt-2 text-sm text-gray-500">
//           {destination.destination_type}
//         </p>

//         <div className="mt-3">
//           ⭐ {destination.avg_rating}
//         </div>

//         <div className="mt-3 font-bold">
//           ${destination.avg_cost_per_day} / day
//         </div>

//         <button className="mt-4 rounded-lg bg-sky-600 px-4 py-2 text-sm text-white">
//           View Details
//         </button>

//       </div>

//     </div>
//   );
// }