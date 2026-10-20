import { useAuth } from "../context/AuthContext";

const Card = () => {
    const { allUsers } = useAuth()
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-1 h-[25vh] shadow-md rounded-lg p-4 flex items-end justify-between">
                <div className="h-full w-fit flex flex-col justify-between">
                    <h1>Total Users</h1>

                    <p className="text-4xl font-extrabold">
                        {allUsers.total}
                    </p>
                    <p
                        className=""
                    >
                        para
                    </p>
                </div>

                <img
                    src="/icons/increment.svg"
                    alt="User registration trend"
                    className=""
                />
            </div>
        </div>
    );
};

export default Card;