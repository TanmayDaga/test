// components/LiveKitVoiceChat.tsx
"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  StartAudio,
} from "@livekit/components-react";
import Playground from "./components/Playground";
import { ConfigProvider, useConfig } from "@/hooks/useConfig";
import { useToast } from "@/hooks/use-toast";
import {
  ConnectionMode,
  ConnectionProvider,
  useConnection,
} from "@/hooks/useConnection";
import { CloudProvider } from "./components/cloud/useCloud";
import { ToastProvider } from "@radix-ui/react-toast";

const LiveKitVoiceChat: React.FC = () => {
  const { shouldConnect, wsUrl, token, mode, connect, disconnect } =
    useConnection();

  const { config } = useConfig();

  const handleConnect = useCallback(
    async (c: boolean, mode: ConnectionMode) => {
      c ? connect(mode) : disconnect();
    },
    [connect, disconnect]
  );

  const showPG = useMemo(() => {
    if (process.env.NEXT_PUBLIC_LIVEKIT_URL) {
      return true;
    }
    if (wsUrl) {
      return true;
    }
    return false;
  }, [wsUrl]);
  return (

            <LiveKitRoom
              className="flex flex-col h-full w-full"
              serverUrl={wsUrl}
              token={
            token    }
              connect={true}
              onError={(e) => {
                console.error(e);
              }}
            >
              <Playground
                onConnect={(c) => {
                  const m = process.env.NEXT_PUBLIC_LIVEKIT_URL ? "env" : mode;
                  handleConnect(c, m);
                }}
              />
              <RoomAudioRenderer />
              <StartAudio label="Click to enable audio playback" />
            </LiveKitRoom>
          </CloudProvider>
        </ConfigProvider>
      </ConnectionProvider>
    </ToastProvider>
  );
};

export default LiveKitVoiceChat;
