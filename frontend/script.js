$(document).ready(function () {
  const apiUrl = "http://localhost:3000/api/users";

  $("#show-login").click(function () {
    $("#register-form").addClass("d-none");
    $("#login-form").removeClass("d-none");
  });

  $("#show-register").click(function () {
    $("#login-form").addClass("d-none");
    $("#register-form").removeClass("d-none");
  });

  $("#show-reset-password").click(function () {
    $("#login-form").addClass("d-none");
    $("#reset-password-form").removeClass("d-none");
  });

  $("#show-login-from-reset").click(function () {
    $("#reset-password-form").addClass("d-none");
    $("#login-form").removeClass("d-none");
  });

  $("#register-form").submit(function (event) {
    event.preventDefault();
    const username = $("#register-username").val();
    const email = $("#register-email").val();
    const password = $("#register-password").val();

    axios
      .post(`${apiUrl}/register`, { username, email, password })
      .then((response) => {
        alert(response.data.msg);
        $("#register-form").trigger("reset");
        $("#show-login").click();
        loadUsers();
      })
      .catch((error) => {
        alert(error.response.data.msg);
      });
  });

  $("#login-form").submit(function (event) {
    event.preventDefault();
    const email = $("#login-email").val();
    const password = $("#login-password").val();

    axios
      .post(`${apiUrl}/login`, { email, password })
      .then((response) => {
        alert(response.data.msg);
        $("#login-form").trigger("reset");
        loadUsers();
      })
      .catch((error) => {
        alert(error.response.data.msg);
      });
  });

  $("#reset-password-form").submit(function (event) {
    event.preventDefault();
    const email = $("#reset-email").val();
    const password = $("#reset-password").val();

    axios
      .patch(`${apiUrl}/reset-password`, { email, password })
      .then((response) => {
        alert(response.data.msg);
        $("#reset-password-form").trigger("reset");
        $("#show-login-from-reset").click();
      })
      .catch((error) => {
        alert(error.response.data.msg);
      });
  });

  function loadUsers() {
    axios
      .get(apiUrl)
      .then((response) => {
        const users = response.data;
        let userTableBody = "";
        users.forEach((user) => {
          userTableBody += `
                        <tr data-toggle="modal" data-target="#userModal" data-id="${user._id}" data-username="${user.username}" data-email="${user.email}">
                            <td>${user.username}</td>
                            <td>${user.email}</td>
                            <td>
                                <button class="btn btn-danger btn-sm delete-user" data-id="${user._id}">Delete</button>
                            </td>
                        </tr>
                    `;
        });
        $("#userTableBody").html(userTableBody);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }

  $("#userModal").on("show.bs.modal", function (event) {
    const button = $(event.relatedTarget);
    const id = button.data("id");
    const username = button.data("username");
    const email = button.data("email");
    const modal = $(this);
    modal.find("#modalUsername").val(username);
    modal.find("#modalEmail").val(email);
    modal
      .find("form")
      .off("submit")
      .on("submit", function (event) {
        event.preventDefault();
        const newUsername = modal.find("#modalUsername").val();
        const newEmail = modal.find("#modalEmail").val();

        axios
          .put(`${apiUrl}/update`, { email, username: newUsername, newEmail })
          .then((response) => {
            alert(response.data.msg);
            modal.modal("hide");
            loadUsers();
          })
          .catch((error) => {
            alert(error.response.data.msg);
          });
      });
  });

  $(document).on("click", ".delete-user", function () {
    const id = $(this).data("id");
    const email = $(this).closest("tr").find("td:nth-child(2)").text();

    if (confirm("Are you sure you want to delete this user?")) {
      axios
        .delete(`${apiUrl}/delete`, { data: { email } })
        .then((response) => {
          alert(response.data.msg);
          loadUsers();
        })
        .catch((error) => {
          alert(error.response.data.msg);
        });
    }
  });

  loadUsers();
});
