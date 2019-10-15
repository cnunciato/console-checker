import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

const cluster = awsx.ecs.Cluster.getDefault();

const task = new awsx.ecs.FargateTaskDefinition("task", {
    cpu: "1024",
    memory: "2048",
    container: {
        image: awsx.ecs.Image.fromPath("image", "."),
    },
});

aws.cloudwatch.onSchedule("schedule", "rate(5 minutes)", new aws.lambda.CallbackFunction<aws.cloudwatch.EventRuleEvent, void>("handler", {
    policies: [
        aws.iam.AWSLambdaFullAccess,
        aws.iam.AmazonEC2ContainerServiceFullAccess,
    ],
    callback: async () => {
        try {
            const response = await task.run({ cluster });

            if (response.failures) {
                response.failures.forEach(failure => {
                    console.error(failure);
                })
            }
        }
        catch(err) {
            console.error(err);
        }
    },
}));
