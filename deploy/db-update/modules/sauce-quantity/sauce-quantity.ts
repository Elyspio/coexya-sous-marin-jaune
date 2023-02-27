import { MongoClient } from "mongodb";
import { Order } from "./entities";

console.log("Add sauce quantity");

(async () => {
	// Use connect method to connect to the server
	const client = await MongoClient.connect(
		"mongodb://root:root@localhost:6003/admin?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-256",
		{
			directConnection: true,
		}
	);
	console.log("Connected successfully to server");
	const db = client.db("coexya-sous-marin-jaune");
	const collection = db.collection<Order>("Order");

	const orders = await collection
		.find(
			{
				"Fries.Sauces": {
					$elemMatch: {
						$type: "string",
					},
				},
			},
			{}
		)
		.toArray();

	const promises = orders.map(async order => {
		return await collection.updateOne(
			{
				_id: order._id,
			},
			{
				$set: {
					Fries: {
						Sauces: order.Fries.Sauces.map(sauce => ({ Sauce: sauce, Amount: 1 })) as any,
					},
				},
			}
		);
	});

	const results = await Promise.all(promises);

	const modified = results.reduce((acc, result) => acc + result.modifiedCount, 0);
	const matched = results.reduce((acc, result) => acc + result.matchedCount, 0);

	console.log({ modified, matched });
})();
