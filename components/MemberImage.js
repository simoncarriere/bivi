import Image from "next/image";

const MemberImage = ({ member }) => {
  return (
    <span className="relative flex-shrink-0 inline-block">
      {member.imageUrl ? (
        <>
          <Image
            className="w-10 h-10 rounded-full"
            src={member.imageUrl}
            alt=""
          />
          <span
            className={classNames(
              member.online ? "bg-green-400" : "bg-gray-300",
              "absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white"
            )}
            aria-hidden="true"
          />
        </>
      ) : (
        <span className="relative inline-block mx-auto">
          <svg
            className="w-12 h-12 text-gray-300 border border-gray-100 rounded-full"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span
            className={`${
              member.online ? "bg-green-400" : "bg-red-400"
            } absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full  ring-2 ring-white`}
          />
        </span>
      )}
    </span>
  );
};

export default MemberImage;
