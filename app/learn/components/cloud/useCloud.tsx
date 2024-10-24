export function CloudProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useCloud() {
  const generateToken: () => Promise<string> = async () => {
    return new Promise(() => {
      return "eyJhbGciOiJIUzI1NiJ9.eyJ2aWRlbyI6eyJyb29tSm9pbiI6dHJ1ZSwicm9vbSI6IjY2ZTM1YWFkMDBjOWRhNmVhYmJjNTRjNSIsInJvb21DcmVhdGUiOnRydWUsImNhblB1Ymxpc2giOnRydWUsImNhblB1Ymxpc2hEYXRhIjp0cnVlfSwiaXNzIjoiQVBJdkp5N1BKaFBaa0RuIiwiZXhwIjoxNzI5Nzg5NDI2LCJuYmYiOjAsInN1YiI6IjY2ZTM1YWFkMDBjOWRhNmVhYmJjNTRjNSJ9.QrvUzPgNGEzptLtT1erYfe_Cra2QmfAnIAHZF3W5zik";
    });
  };
  const wsUrl = "wss://vanii-490yrzvm.livekit.cloud";

  return { generateToken, wsUrl };
}
