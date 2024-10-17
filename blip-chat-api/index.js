import { Router } from 'itty-router';
import { verifyIdToken } from './firebase-admin';

const router = Router();

router.post('/api/validate-api-key', async (request) => {
  const { apiKey } = await request.json();
  
  // Validate the API key with Blip
  const isValid = await validateBlipApiKey(apiKey);
  
  if (isValid) {
    // Generate a custom token for Firebase Auth
    const token = await generateFirebaseCustomToken(apiKey);
    return new Response(JSON.stringify({ token }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    return new Response('Invalid API Key', { status: 401 });
  }
});

router.get('/api/contacts', async (request) => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response('Unauthorized', { status: 401 });
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await verifyIdToken(idToken);
    const apiKey = decodedToken.uid; // Assuming we stored the API key as the UID

    const { page, perPage } = request.query;
    const contacts = await getBlipContacts(apiKey, page, perPage);
    
    return new Response(JSON.stringify(contacts), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response('Unauthorized', { status: 401 });
  }
});

router.get('/api/conversation/:id', async (request) => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response('Unauthorized', { status: 401 });
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await verifyIdToken(idToken);
    const apiKey = decodedToken.uid; // Assuming we stored the API key as the UID

    const { id } = request.params;
    const conversation = await getBlipConversation(apiKey, id);
    
    return new Response(JSON.stringify(conversation), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response('Unauthorized', { status: 401 });
  }
});

addEventListener('fetch', (event) => {
  event.respondWith(router.handle(event.request));
});

// Implement these functions to interact with the Blip API
async function validateBlipApiKey(apiKey) {
  // TODO: Implement Blip API key validation
}

async function getBlipContacts(apiKey, page, perPage) {
  // TODO: Implement fetching contacts from Blip API
}

async function getBlipConversation(apiKey, contactId) {
  // TODO: Implement fetching conversation from Blip API
}

async function generateFirebaseCustomToken(apiKey) {
  // TODO: Implement Firebase custom token generation
}