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

  return useQuery({
    queryKey: ['user', String(userId)],
    queryFn: () => userClient.find({id: userId}).then(resp => resp.data),
    ...options,
  });
}

export function useCreateUser(options) {
  const userClient = useUserClient();
  return useMutation({
    mutationFn: attributes => userClient.create({attributes}),
    ...options,
  });
}

export function useUpdateUser(user) {
  const userClient = useUserClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attributes =>
      userClient.update({
        type: 'users',
        id: user.id,
        attributes,
      }),
    onSuccess: () =>
      queryClient.removeQueries({queryKey: ['user', String(user.id)]}),
  });
}
