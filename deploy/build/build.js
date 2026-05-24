import path from "node:path";
import { fileURLToPath } from "node:url";
import { runKubernetesDeploy } from "@elyspio/kubernetes-deploy";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dryRun = process.argv.includes("--dry-run");

runKubernetesDeploy(
	{
		cacheFile: path.join(__dirname, "cache", ".build-counter"),
		chartDir: "P:\\own\\common\\keycloak\\kubernetes\\apps\\coexya-sous-marin-jaune",
		composeDir: __dirname,
		deployScript: "update.ps1",
	},
	{ dryRun },
);
