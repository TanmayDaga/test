import { GetApiInput } from "@/types/api";
import { GetApi } from "@/lib/apis/GetApi";
const URL = "api/v1/user/get-user";

export async function GetUser<UserDetails>({
  axios,
  onSuccess,
  onError,
}: Omit<GetApiInput<UserDetails>, "url">) {
  GetApi<UserDetails>({
    url: URL,
    axios,
    onSuccess,
    onError,
  });
}
