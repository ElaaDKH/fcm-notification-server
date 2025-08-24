const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin with service account
const serviceAccount = {
  "type": "service_account",
  "project_id": "fixtrack-7f2e1",
  "private_key_id": "41f7ad4d983b8ef5be872b0d188d48c8c8224976",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDDEuXMWD4PXozH\nLxFqxxxwosD/yWle9v25J9dJspHkiuPboodJw9WewmOC6cWdn56lRPSGB738wPWa\nqDx3q6eGGQ8g/MqB8mnwO30gtyzSv1eIwugxEHtsnU7bj8JCmh8RA0y/ZVyoZUBt\nahniehVZ+GniQxcIP2H/Cn84g2BhVasQsuansFcCzxUKZ12DIPXjtMjD/7woyXCp\nRLXR5cc/T01yok2LKFw+mviXFN3LLeN7IJPNqoQe2JN3y0Ous80AEsMfWJDz6ZhX\nEpHd/j++BOBigNKTcXpJDJY2CZTj/fFcb3KNoGQoLIwWZINuicLPCavoJEq8VQGx\nrEHIm93HAgMBAAECggEAA3rq+Jrrvpyj1LIP8BpyUInS+UBKY0mp/vAQ+WyEp8vA\ncNCFnsm0PIzjibCZsi2ro2lctSDDFrNSw7iT+OtXxDEz4CGXvJ+PU5wvIbjPDoZQ\nyo/FUn4w1L6bzNT4c1cQdcX0ZIQG8X0AXzNXJB3tXHH5w4Q6atIPa40OoNYYUpyR\np5XmXafitJCb9JmQfFFy1/L8E8aL1VXHiz25eczeFxXSMm6Zu0PPxbeKB3M8agdJ\nZwDCLGxYi82rOwPwSSMa6Xkw5ggNTcctaFlNQosWPLwJvvvA/fVD2b1wHiMKTB7q\n6tkFkhZnoIF2feyfbrCV6TFKWROSvBDH0PBnLsVHiQKBgQDvynBwDq+1u2q4jZiM\n41eTq+xpQvrYIHR+pdkIaPi/uy6d5NN0wtBXYuQwlKoMMoPmNjHoyVRhDNtX9kIO\n7dKF79fIyEbHCe9pS3xjqzFeafemtjdlNUbw+RUT/B38QzCb0luKTmIv83K3GXex\nzL5+jW/KjkcM04lu2AzpiSo2xQKBgQDQQqKLAXDn9G7fMxVfaJKBWPdGmHpDYyhj\ncsdTOJjkKPfQn45wMX12aVHuEXeUQH2dLbAXeXpy0hHhOEDX47kSrfL+7mDPZ3qj\nbKsLxeSzUwg65gtFL1ZBK7wBRYAxPwSIoMoXIbB/k8uUClmdDlxFW5+Bw8BcPEq6\nmtlcqXErGwKBgD4q7vGubRGhsG5+j2Ffg5IOjbFQozYrW+iF2PncNTmILvLSo5vu\n8hLl2aFauaeF5TpnLJNctxqeObPZbZDvSZhd8UTl36u0wLQ81NgGRztiH8nCDiSY\nJndNLJDM2X1QcibD5+W4oq4p4MDlwml/Wpf21VffgT4rDcOGEfruC9q9AoGBALgK\nGtASfu9MT+pIn1uH8ugBccveFTWV2+w+Uy0U9++w0IZ5agt1gLTyj6d9ohnN//O1\nm0azYGU1hP1tk8f1Aukh9XoZuE2w2WywLFukDt31w3EhN9Z05ZmEB4lsHMPoN55x\n0QUuDWZAeoghuV2Ugi/8rvGixkv8L+HF084SIuL/AoGBAJz/2TuZO5wVh+KquYP8\nCqCvNd167LGrznFYgDRQeW0pYyq5c7Lltnq7wtyhpG8NHNQxmoYjUAbJQYetqJKo\nP1iOFizSKHtqVEjER99x8Ow9RctxKlPaCUmghOIm0+oJ4ZpRl30AUXdKEfWsXAKg\nep4MwifcqyDQZ0MUkXBwyhAN\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@fixtrack-7f2e1.iam.gserviceaccount.com",
  "client_id": "104419383025550170899",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'FCM Server is running!' });
});

// Send notification to topic
app.post('/send-notification', async (req, res) => {
  try {
    const { title, body, topic, data } = req.body;
    
    console.log('Sending notification:', { title, body, topic });
    
    const message = {
  // Remove the notification object completely
  data: {
    title: title,        // Move title to data
    body: body,          // Move body to data
    ...(data || {})      // Include any additional data
  },
  topic: topic,
  android: {
    priority: 'high',
    // Remove the notification object from android section too
  }
};
    
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    
    res.json({ 
      success: true, 
      messageId: response 
    });
    
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Send problem notification

app.post('/send-problem-notification', async (req, res) => {
  try {
    const { description, location, reportedBy, reporterRole } = req.body;
    
    console.log(`Problem reported by: ${reportedBy} (Role: ${reporterRole})`);
    
    // Determine which topics to send to based on reporter role
    let topics = [];
    
    if (reporterRole === 'OPERATOR') {
      topics = ['technicians', 'admins'];  // Operators → notify techs & admins
      console.log('Operator reported problem → notifying technicians and admins');
    } else if (reporterRole === 'ADMIN') {
      topics = ['technicians'];  // Admins → notify only technicians (not operators)
      console.log('Admin reported problem → notifying only technicians');
    } else {
      console.log(`Unknown reporter role: ${reporterRole} → using default (techs + admins)`);
      topics = ['technicians', 'admins'];  // Default fallback
    }
    
    console.log(`Sending notifications to topics: ${topics.join(', ')}`);
    
    const results = [];
    
    // Send to each topic
    for (const topic of topics) {
      const message = {
        notification: {
          title: 'Nouveau problème signalé',
          body: `${description} - ${location}`
        },
        data: {
          type: 'new_problem',
          description: description,
          location: location,
          reportedBy: reportedBy,
          reporterRole: reporterRole,  // Add this
          timestamp: Date.now().toString()
        },
        topic: topic,
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            default_vibrate_timings: true
          }
        }
      };
      
      try {
        const response = await admin.messaging().send(message);
        console.log(`✅ Problem notification sent to ${topic}:`, response);
        results.push({ topic, success: true, messageId: response });
      } catch (error) {
        console.error(`❌ Error sending to ${topic}:`, error);
        results.push({ topic, success: false, error: error.message });
      }
    }
    
    res.json({ 
      success: true, 
      results: results,
      totalTopics: topics.length,
      successCount: results.filter(r => r.success).length
    });
    
  } catch (error) {
    console.error('Error in send-problem-notification:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send status update notification
app.post('/send-status-update', async (req, res) => {
  try {
    const { problemId, newStatus, description, location } = req.body;
    
    const message = {
      notification: {
        title: 'Statut du problème mis à jour',
        body: `${description} - Nouveau statut: ${newStatus}`
      },
      data: {
        type: 'status_update',
        problemId: problemId,
        newStatus: newStatus,
        description: description,
        location: location,
        timestamp: Date.now().toString()
      },
      topic: 'technicians',
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          default_vibrate_timings: true
        }
      }
    };
    
    const response = await admin.messaging().send(message);
    console.log('Status update sent:', response);
    
    res.json({ success: true, messageId: response });
    
  } catch (error) {
    console.error('Error sending status update:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send reassignment notification
app.post('/send-reassignment', async (req, res) => {
  try {
    const { technicianName, title, message, problemId } = req.body;
    
    const fcmMessage = {
      notification: {
        title: title,
        body: message
      },
      data: {
        type: 'reassignment',
        problemId: problemId,
        technicianName: technicianName,
        timestamp: Date.now().toString()
      },
      topic: `technician_${technicianName.replace(/\s+/g, '_').toLowerCase()}`,
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          default_vibrate_timings: true
        }
      }
    };
    
    const response = await admin.messaging().send(fcmMessage);
    console.log('Reassignment notification sent:', response);
    
    res.json({ success: true, messageId: response });
    
  } catch (error) {
    console.error('Error sending reassignment:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 FCM Server running on port ${PORT}`);
});
