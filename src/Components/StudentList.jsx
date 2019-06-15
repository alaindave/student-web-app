import React from "react";
import axios from "axios";
import Student from "./Student";
import "../student.css";

export default class StudentsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      students: [],
      key_word: "",
      tag_key_word: "",
      studentsWithTags: [],
      showStudentNames: true,
      showStudentTags: false
    };
  }

  componentDidMount() {
    axios.get("https://hatchways.io/api/assessment/students ").then(res => {
      this.setState({ students: res.data.students });
    });
  }

  searchByNameHandler = e => {
    this.setState({
      key_word: e.target.value,
      showStudentNames: true,
      showStudentTags: false
    });
  };

  searchByTagHandler = e => {
    this.setState({
      tag_key_word: e.target.value,
      showStudentNames: false,
      showStudentTags: true
    });
  };

  searchStudentByName = keyWord => {
    return x => {
      return (
        x.firstName.toLowerCase().includes(keyWord.toLowerCase()) ||
        x.lastName.toLowerCase().includes(keyWord.toLowerCase()) ||
        !keyWord
      );
    };
  };

  searchStudentByTag = tag_keyWord => {
    return x => {
      for (let i = 0; i < x.tags.length; i++) {
        return x.tags[i].includes(tag_keyWord) || !tag_keyWord;
      }
    };
  };

  handleTags = (id, tags) => {
    //call function that retrieves student by ID and add tags
    this.retrieveStudent(id, tags);
  };

  retrieveStudent = (id, tags) => {
    //get student with the given ID
    let student = this.state.students.filter(student => student.id === id);

    //push tag onto array
    let tagArray = [];
    tagArray.push(tags);

    //create tag property and add tag
    student[0].tags = tagArray;
    let newStudentWithTags = [...this.state.studentsWithTags, student[0]];

    //remove duplicates from Array
    let uniqueStudents = Array.from(new Set(newStudentWithTags));

    this.setState({
      studentsWithTags: uniqueStudents
    });
  };

  render() {
    return (
      <div>
        <div className="tagAndName">
          <form>
            <input
              type="text"
              onChange={this.searchByNameHandler}
              placeholder="Search by name..."
              value={this.state.key_word}
            />
          </form>
        </div>

        <div className="tagAndName">
          <form>
            <input
              type="text"
              onChange={this.searchByTagHandler}
              placeholder="Search by tags..."
              value={this.state.tag_key_word}
            />
          </form>
        </div>

        {this.state.showStudentNames &&
          this.state.students
            .filter(this.searchStudentByName(this.state.key_word))
            .map(student => {
              return (
                <Student
                  key={student.id}
                  id={student.id}
                  pic={student.pic}
                  firstName={student.firstName}
                  lastName={student.lastName}
                  email={student.email}
                  company={student.company}
                  skill={student.skill}
                  grades={student.grades}
                  tags={student.tags}
                  getTags={this.handleTags}
                />
              );
            })}

        {this.state.showStudentTags &&
          this.state.studentsWithTags
            .filter(this.searchStudentByTag(this.state.tag_key_word))
            .map(student => {
              return (
                <Student
                  key={student.id}
                  id={student.id}
                  pic={student.pic}
                  firstName={student.firstName}
                  lastName={student.lastName}
                  email={student.email}
                  company={student.company}
                  skill={student.skill}
                  grades={student.grades}
                  tags={student.tags}
                  getTags={this.handleTags}
                />
              );
            })}
      </div>
    );
  }
}
