import * as path from "node:path";
import { execSync } from "node:child_process";

type NSwagConf = {
	//  Fichier de configuration nswag
	file: string; //  url du Swagger.json
	input: string; // fichier de destination (généré)
	outputFile: string; // fichier de configuration de l'authentification (contenant les classes AuthorizedApiBase et IConfig)
};

function generateFromNswag({ outputFile, file, input }: NSwagConf) {
	const command = `nswag run ${file} /variables:INPUT_URL=${input},OUTPUT_FILE=${outputFile}`;

	console.log(`Executing "${command}"`);
	execSync(command, { stdio: "inherit" });
}

const __dirname = import.meta.dirname;

console.log("Generating http clients for Api");
generateFromNswag({
	input: "https://localhost:16000/swagger/v1/swagger.json",
	file: path.resolve(__dirname, "nswag-api-rest.nswag"),
	outputFile: path.resolve(__dirname, "..", "src", "core", "apis", "backend", "generated.ts"),
});
