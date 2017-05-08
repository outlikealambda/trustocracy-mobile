const api = 'http://127.0.0.1:3714/api';

export const connected = (topicId, userId) => global.fetch(`${api}/topic/${topicId}/connected/${userId}`);
export const influence = (topicId, userId) => global.fetch(`${api}/topic/${topicId}/user/${userId}/influence`);
export const topics = () => global.fetch(`${api}/topic`);
export const topicTitle = topicId => global.fetch(`${api}/topic/${topicId}`);
export const opinions = topicId => global.fetch(`${api}/topic/${topicId}/opinions`);
export const opinion = opinionId => global.fetch(`${api}/topic/opinion/${opinionId}`);
export const target = {
  set: (topicId, userId, targetId) => global.fetch(
    `${api}/topic/${topicId}/user/${userId}/target/${targetId}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'plain/text' },
      body: ''
    }
  ),
  clear: (topicId, userId) => global.fetch(
    `${api}/topic/${topicId}/user/${userId}`,
    { method: 'DELETE' }
  )
};
export const friends = {
  get: userId => global.fetch(`${api}/user/${userId}/friends`)
};
