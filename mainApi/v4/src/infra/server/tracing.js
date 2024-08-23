
import { NodeSDK } from "@opentelemetry/sdk-node";
// import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { MySQL2Instrumentation } from "@opentelemetry/instrumentation-mysql2";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";

const sdk = new NodeSDK({
    serviceName: "just translate",
    traceExporter: new OTLPTraceExporter({
        url: 'http://localhost:4317',
        compression: 'gzip'
    }),
    instrumentations: [
        new HttpInstrumentation(),
        new MySQL2Instrumentation()

    ]
})

process.on('beforeExit', async () => {
    await sdk.shutdown()
})

export const initalizeTracing = async () => {
    return sdk.start()
}