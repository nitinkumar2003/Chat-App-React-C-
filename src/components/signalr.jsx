// signalr.js
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const connection = new HubConnectionBuilder()
    .configureLogging(LogLevel.Information)
    .withUrl("https://localhost:7170/chathub")
    .withAutomaticReconnect()
    .build();

export default connection;
