export const validateRoomCreation = (req, res, next) => {
  const { name, category } = req.body;
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = 'Room name field is required';
  } else if (name.trim().length < 3) {
    errors.name = 'Room name must be at least 3 characters long';
  }

  if (category && !['Cinema', 'Music', 'Tech', 'Gaming'].includes(category)) {
    errors.category = 'Category must be one of: Cinema, Music, Tech, Gaming';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation schema mismatch',
      errors,
    });
  }

  next();
};

export default validateRoomCreation;
