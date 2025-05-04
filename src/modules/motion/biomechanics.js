export function calculateJointAngles(keypoints) {
  // Convert keypoints to joints object if needed
  const joints = Array.isArray(keypoints) 
    ? keypoints.reduce((acc, kp) => {
        acc[kp.name || kp.part] = { x: kp.x, y: kp.y, score: kp.score || kp.confidence };
        return acc;
      }, {})
    : keypoints;

  return {
    leftKnee: getAngle(joints.left_hip, joints.left_knee, joints.left_ankle),
    rightKnee: getAngle(joints.right_hip, joints.right_knee, joints.right_ankle),
    leftElbow: getAngle(joints.left_shoulder, joints.left_elbow, joints.left_wrist),
    rightElbow: getAngle(joints.right_shoulder, joints.right_elbow, joints.right_wrist),
    torsoLean: getTorsoLeanAngle(
      joints.left_shoulder, 
      joints.right_shoulder, 
      joints.left_hip, 
      joints.right_hip
    )
  };
}

// Keep the rest of your biomechanics.js functions unchanged
export function checkBiomechanics(angles, timestamp, exerciseType = 'generic') {
  const feedback = [];

  // Squat exercise-specific checks
  if (exerciseType === 'squat') {
    if (angles.leftKnee < 90 || angles.rightKnee < 90) {
      feedback.push({
        timestamp,
        joint: 'knee',
        issue: 'depth',
        severity: 'medium',
        correction: 'Lower your hips more during squats.',
        score: 70
      });
    }
  }

  // Knee hyperextension check
  if (angles.leftKnee > 190 || angles.rightKnee > 190) {
    feedback.push({
      timestamp,
      joint: 'knee',
      issue: 'hyperextension',
      severity: 'high',
      correction: 'Keep a slight bend in the knees.',
      score: 50
    });
  }

  // Excessive torso lean check
  if (angles.torsoLean > 30) {
    feedback.push({
      timestamp,
      joint: 'torso',
      issue: 'excessive_lean',
      severity: 'medium',
      correction: 'Keep your torso more upright.',
      score: 65
    });
  }

  return feedback;
}

// Helper function to calculate the angle between three points
function getAngle(a, b, c) {
  if (!a || !b || !c || a.score < 0.3 || b.score < 0.3 || c.score < 0.3) return 0;

  const radians = Math.atan2(c.y - b.y, c.x - b.x) - 
                  Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs(radians * 180 / Math.PI);
  return angle > 180 ? 360 - angle : angle;
}

// Helper function to calculate torso lean angle
function getTorsoLeanAngle(leftShoulder, rightShoulder, leftHip, rightHip) {
  if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) return 0;

  // Calculate shoulder midpoint
  const shoulderMid = {
    x: (leftShoulder.x + rightShoulder.x) / 2,
    y: (leftShoulder.y + rightShoulder.y) / 2
  };

  // Calculate hip midpoint
  const hipMid = {
    x: (leftHip.x + rightHip.x) / 2,
    y: (leftHip.y + rightHip.y) / 2
  };

  // Calculate angle from vertical
  const dx = shoulderMid.x - hipMid.x;
  const dy = shoulderMid.y - hipMid.y;
  return Math.abs(Math.atan2(dx, dy) * 180 / Math.PI);
}
