import client from "@repo/db/client";


const Users = async () => {
    const users = await client.user.findMany({});
    console.log(users);

    return (<div>
        {JSON.stringify(users)}
    </div>);
}

export default Users;