
const api = 'http://localhost:3714/api';

const fetch = (path, opts = {}) => global.fetch(`${api}/${path}`, opts);

export const connected = (topicId, userId) => fetch(`topic/${topicId}/connected/${userId}`);

export const influence = (topicId, userId) => fetch(`topic/${topicId}/user/${userId}/influence`);

export const topics = () => fetch('topic');

export const topicTitle = topicId => fetch(`topic/${topicId}`);

export const opinions = topicId => fetch(`topic/${topicId}/opinions`);

export const prompts = topicId => fetch(`topic/${topicId}/prompts`);

export const opinion = opinionId => fetch(`opinion/${opinionId}`);

export const target = {
  set: (topicId, userId, targetId) => fetch(
    `topic/${topicId}/user/${userId}/target/${targetId}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'plain/text' },
      body: ''
    }
  ),

  clear: (topicId, userId) => fetch(
    `topic/${topicId}/user/${userId}`,
    { method: 'DELETE' }
  )
};

export const delegate = {
  getInactive: userId => fetch(`user/${userId}/pool`),

  getActive: userId => fetch(`user/${userId}/friends`),

  rank: (userId, delegates) => fetch(
    `user/${userId}/delegates`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        delegates
      })
    }
  ),

  add: (userId, inputEmail) => fetch(
    `user/${userId}/pool`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: inputEmail
      })
    }
  ),

  remove: (userId, friendId) => fetch(
    `user/${userId}/pool/${friendId}`,
    { method: 'DELETE' }
  ),

  activate: () => Promise.resolve({status: 200}),

  deactivate: () => Promise.resolve({status: 200})
};
