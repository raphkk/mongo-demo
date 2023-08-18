const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...', err));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [ String ],
  date: { type: Date, default: Date.now },
  isPublished: Boolean
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
  const course = new Course({
    name: 'Angular Course',
    author: 'Raph',
    tags: ['angular', 'frontend'],
    isPublished: true
  });
  
  const result = await course.save();
  console.log(result);
};

async function getCourses() {
  const pageNumber = 2;
  const pageSize = 10;
  
  const courses = await Course
  //.find({ price: { $gte: 10, $lte: 20 } }) -- Using Comparison Query Operators
  //.find({ price: { $in: [10, 15, 20]}})
  //.find() -- Use find before using Logical Query Operators below
  //.or([{ author: 'Raph'}, {isPublished: true} ]) -- Using Logical Query Operators
  //.and([ ]) 
  // Below on line 39 is Regular Expressions used to find courses with Author that starts with Raph
  //.find({ author: /^Raph/}) // ^ Regex is used to find author with name that starts with Raph
  //.find ({ author: /KK$/i}) //$ Regex is used to find author with name that ends with KK(for example). 
  //i Regex is used to make the query NOT case sensitive. Google if you forgot Regex
  //.find({ author: /.*Raph.*/}) // .* in Regex is used to find author which contains Raph

  .find({ author: 'Raph', isPublished: true})
  .skip((pageNumber - 1 ) * pageSize) // This method is used to implement pagination
  .limit(pageSize)
  .sort({ name: 1})
  .select({ name: 1, tags: 1 })
  .count(); // count is used to find the count of documents that match the criteria above.
  console.log(courses);
};

async function updateCourse(id) {
  const course = await Course.findById(id);
  if(!course) return;

  course.isPublished = true;
  course.author = 'Another Author';
  
  const result = await course.save();
  console.log(result);
}
updateCourse("64dc1f949e2a2526746a5f56");