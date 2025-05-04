export const exerciseRules = {
  squat: {
    description: "في تمرين السكوات، يجب أن تكون زاوية الركبة أقل من 90 درجة.",
    jointAngles: {
      leftKnee: { min: 80, max: 120 },
      rightKnee: { min: 80, max: 120 }
    }
  },
  push_up: {
    description: "في تمرين الضغط، يجب أن تكون زاوية الكوع 90 درجة تقريبًا.",
    jointAngles: {
      leftElbow: { min: 75, max: 105 },
      rightElbow: { min: 75, max: 105 }
    }
  },
  deadlift: {
    description: "في تمرين deadlift، يجب الحفاظ على استقامة الظهر أثناء رفع الوزن.",
    jointAngles: {
      leftHip: { min: 170, max: 180 },
      rightHip: { min: 170, max: 180 }
    }
  },
  bench_press: {
    description: "في تمرين bench press، يجب أن تكون زاوية الكوع 90 درجة أثناء الهبوط.",
    jointAngles: {
      leftElbow: { min: 75, max: 105 },
      rightElbow: { min: 75, max: 105 }
    }
  }
};

export function calculateJointAngles(keypoints) {
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
    leftHip: getAngle(joints.left_shoulder, joints.left_hip, joints.left_knee),
    rightHip: getAngle(joints.right_shoulder, joints.right_hip, joints.right_knee)
  };
}

export function isExerciseCorrect(landmarks, exercise) {
  const rules = exerciseRules[exercise]?.jointAngles;
  if (!rules) return { correct: false, feedback: ["Unknown exercise type"] };

  let correct = true;
  const feedback = [];

  for (const [joint, range] of Object.entries(rules)) {
    const angle = calculateJointAngles(landmarks)[joint];
    
    if (angle < range.min || angle > range.max) {
      correct = false;
      feedback.push(`${joint.replace(/([A-Z])/g, ' $1').toLowerCase()} angle is out of range (${range.min}-${range.max}°). Current: ${angle.toFixed(1)}°`);
    }
  }

  return { correct, feedback };
}

function getAngle(a, b, c) {
  if (!a || !b || !c || a.score < 0.3 || b.score < 0.3 || c.score < 0.3) return 0;

  const radians = Math.atan2(c.y - b.y, c.x - b.x) - 
                  Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs(radians * 180 / Math.PI);
  return angle > 180 ? 360 - angle : angle;
}