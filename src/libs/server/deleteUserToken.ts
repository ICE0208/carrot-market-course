import client from "./client";

export async function deleteUserToken(userId: number) {
  const oldTokens = await client.token.findMany({
    where: {
      userId,
    },
  });

  // 이제 oldTokens를 비동기적으로 삭제합니다.
  const deletionPromises = oldTokens.map((token) => {
    return client.token.delete({
      where: {
        id: token.id,
      },
    });
  });

  return await Promise.all(deletionPromises); // 모든 삭제 작업을 병렬로 실행
}
