import {ResourceClient} from '@codingitwrong/jsonapi-client';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useMemo} from 'react';
import httpClient from './httpClient';
import {useToken} from './token';

function useUserClient() {
  const {token} = useToken();

  const userClient = useMemo(() => {
    const client = httpClient({token});
    return new ResourceClient({name: 'users', httpClient: client});
  }, [token]);

  return userClient;
}

export function useCurrentUser(options) {
  const userClient = useUserClient();
  const {
    token: {userId},
  } = useToken();

  return useQuery(
    ['user', String(userId)],
    () => userClient.find({id: userId}).then(resp => resp.data),
    options,
  );
}

export function useUpdateUser(user) {
  const boardClient = useUserClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attributes =>
      boardClient.update({
        type: 'users',
        id: user.id,
        attributes,
      }),
    onSuccess: () =>
      queryClient.removeQueries({queryKey: ['user', String(user.id)]}),
  });
}
