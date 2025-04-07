import { motion } from 'framer-motion';
import { useSpring, animated } from 'react-spring';

function UserStats({ user }) {
  const categories = user
    ? [
        { name: 'Mobility', points: Number(user.Mobility?.Points || 0) },
        { name: 'Consumption', points: Number(user.Consumption?.Points || 0) },
        { name: 'Waste', points: Number(user.Waste?.["Points from Donation"] || 0) + Number(user.Waste?.["Points from Compost"] || 0) },
        { name: 'Energy', points: Number(user.Energy?.Points || 0) },
        { name: 'Water', points: Number(user.Water?.Points || 0) },
        { name: 'Community', points: Number(user.Community?.Points || 0) },
      ]
    : [{ name: 'Loading...', points: 0 }];

  const totalPoints = categories.reduce((sum, cat) => sum + cat.points, 0);

  return (
    <motion.div
      className="flex flex-col justify-between h-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-3">
        {categories.map((category, idx) => {
          const pointsSpring = useSpring({
            from: { number: 0 },
            to: { number: category.points },
            config: { tension: 200, friction: 20 },
          });
          return (
            <motion.div
              key={idx}
              className="flex justify-between text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <span className="text-stone-400">{category.name}</span>
              <animated.span className="holo-text">
                {pointsSpring.number.to(n => `${n.toFixed(2)} Pts`)}
              </animated.span>
            </motion.div>
          );
        })}
      </div>
      <motion.p
        className="text-xl font-bold holo-text mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        Total: {totalPoints.toFixed(2)} Pts
      </motion.p>
    </motion.div>
  );
}

export default UserStats;