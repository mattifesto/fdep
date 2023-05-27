#!/usr/bin/env node

const yaml =
require(
    'js-yaml'
);

const fs =
require(
    'fs'
);

const util =
require(
    "node:util"
);

const child_process =
require(
    "node:child_process"
);

const exec =
util.promisify(
    child_process.exec
);

(async function ()
{
    try
    {
        let command =
        "ack -g 'fdep.yaml$'"

        process.stdout.write(
            command + "\n"
        );

        let result =
        await exec(
            command
        );

        console.log(
            "results:\n" +
            result.stdout
        );

        let yamlFiles =
        result.stdout.trim().split("\n");

        console.log(
            "results 2:\n" +
            JSON.stringify(yamlFiles)
        );

        for (
            index = 0;
            index < yamlFiles.length;
            index += 1
        ) {
            let yamlFile =
            yamlFiles[
                index
            ];

            let yamlAsString =
            fs.readFileSync(
                yamlFile,
                'utf8'
            );

            const doc =
            yaml.load(
                yamlAsString
            );

            console.log(
                "doc:\n" +
                JSON.stringify(doc)
            );

            /**
             * BUGBUG we only support one item
             * BUGBUG we need to escape the regex
             */

            let regex =
            doc.items[0].regex;

            let command =
            `ack --php --css --js --heading --match '${regex}' --ignore-dir=data --sort-files`;

            console.log(
                `\n\n\n${command}\n`
            );

            let results =
            await exec(
                command
            );

            console.log(
                `results:\n${results.stdout}`
            );
        }
        // for
    }

    catch (
        error
    ) {
        process.stderr.write(
            error.message
        );
    }
}
)();
