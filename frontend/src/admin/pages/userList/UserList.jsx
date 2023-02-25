import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../../../components/Footer/Footer";
import LoadingBox from "../../../components/Utilities/LoadingBox";
import MessageBox from "../../../components/Utilities/MessageBox";
import { getError } from "../../../components/Utilities/Utils";
import { Context } from "../../../Context/Context";
import "./styles.scss";
import { DataGrid } from "@mui/x-data-grid";
import { URL } from "../../../base_url/Base_URL";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, users: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "BLOCK_REQUEST":
      return { ...state, loadingBlock: true, successBlock: false };
    case "BLOCK_SUCCESS":
      return { ...state, loadingBlock: false, successBlock: true };
    case "BLOCK_FAIL":
      return {
        ...state,
        loadingBlock: false,
        successBlock: false,
      };
    case "BLOCK_RESET":
      return {
        ...state,
        loadingBlock: false,
        successBlock: false,
      };

    case "UNBLOCK_REQUEST":
      return { ...state, loadingUnBlock: true, successUnBlock: false };
    case "UNBLOCK_SUCCESS":
      return { ...state, loadingUnBlock: false, successUnBlock: true };
    case "UNBLOCK_FAIL":
      return {
        ...state,
        loadingUnBlock: false,
        successUnBlock: false,
      };
    case "UNBLOCK_RESET":
      return {
        ...state,
        loadingUnBlock: false,
        successUnBlock: false,
      };

    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return {
        ...state,
        loadingDelete: false,
        successDelete: false,
      };
    case "DELETE_RESET":
      return {
        ...state,
        loadingDelete: false,
        successDelete: false,
      };

    default:
      return state;
  }
};

const columns = [
  { field: "name", headerName: "name", width: 150 },
  { field: "email", headerName: "Email", width: 230 },
  {
    field: "isSeller",
    headerName: "isSeller",
    width: 100,
    renderCell: (params) => {
      return (
        <>
          <div className={`cellWithAdminSellerStatus ${params.row.isBlocked}`}>
            {params.row.isSeller === true ? (
              <span className="yes">YES</span>
            ) : (
              <span className="no">NO</span>
            )}
          </div>
        </>
      );
    },
  },
  {
    field: "isAdmin",
    headerName: "isAdmin",
    width: 100,
    renderCell: (params) => {
      return (
        <>
          <div className={`cellWithAdminSellerStatus ${params.row.isBlocked}`}>
            {params.row.isAdmin === true ? (
              <span className="yes">YES</span>
            ) : (
              <span className="no">NO</span>
            )}
          </div>
        </>
      );
    },
  },
  {
    field: "status",
    headerName: "Status",
    width: 160,
    renderCell: (params) => {
      return (
        <>
          <div className={`cellWithStatus ${params.row.isBlocked}`}>
            {params.row.isBlocked === true ? (
              <span className="blocked">Blocked</span>
            ) : (
              <span className="active">Active</span>
            )}
          </div>
        </>
      );
    },
  },
];

function UserList() {
  const { state } = useContext(Context);
  const { userInfo } = state;
  const navigate = useNavigate();
  const [
    { loading, error, users, successBlock, successUnBlock, successDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`${URL}/api/users`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL" });
      }
    };
    if (successUnBlock || successBlock || successDelete) {
      dispatch({ type: "UNBLOCK_RESET" });
      dispatch({ type: "BLOCK_RESET" });
      dispatch({ type: "DELETE_RESET" });
    }
    fetchData();
  }, [successBlock, successDelete, successUnBlock, userInfo]);

  //==============
  //BLOCK HANDLER
  //==============
  const blockHandler = async (user) => {
    if (user.isAdmin === true) {
      toast.error("Can Not Block Admin User");
    } else {
      try {
        await axios.put(`${URL}/api/users/block/${user.id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "BLOCK_SUCCESS" });
      } catch (err) {
        toast.error(getError(err), { position: "bottom-center" });
        dispatch({ type: "BLOCK_FAIL" });
      }
    }
  };

  //==============
  //UNBLOCK HANDLER
  //==============
  const unBlockHandler = async (user) => {
    try {
      dispatch({ type: "UNBLOCK_REQUEST" });
      await axios.put(`${URL}/api/users/unblock/${user.id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: "UNBLOCK_SUCCESS" });
    } catch (err) {
      toast.error(getError(err), { position: "bottom-center" });
      dispatch({ type: "UNBLOCK_FAIL" });
    }
  };

  //USER DELETE
  const deleteHandler = async (user) => {
    if (window.confirm("Are you sure to delete this user?")) {
      try {
        await axios.delete(`${URL}/api/users/${user.id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success("user deleted successfully", {
          position: "bottom-center",
        });
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        toast.error(getError(err), { position: "bottom-center" });
        dispatch({ type: "DELETE_FAIL" });
      }
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Actions",
      width: 300,
      renderCell: (user) => {
        return (
          <div className="cellAction">
            <div onClick={() => blockHandler(user)} className="blockButton">
              Block
            </div>
            <div onClick={() => unBlockHandler(user)} className="blockButton">
              UnBlock
            </div>
            <div onClick={() => deleteHandler(user)} className="deleteButton">
              Delete
            </div>
            <Link to={`/admin/useredit/${user.id}`}>
              <div className="viewButton">View</div>
            </Link>
          </div>
        );
      },
    },
  ];
  return (
    <>
      <div className="box_style_list">
        <Helmet>
          <title>User List</title>
        </Helmet>
        <div className="box_list_box">
          {" "}
          <div className="datatable">
            <h1>All Users</h1>
            {loading ? (
              <LoadingBox></LoadingBox>
            ) : error ? (
              <MessageBox>{error}</MessageBox>
            ) : (
              <DataGrid
                className="datagrid"
                rows={users}
                columns={columns.concat(actionColumn)}
                pageSize={10}
                rowsPerPageOptions={[10]}
                checkboxSelection
              />
            )}
          </div>
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </>
  );
}

export default UserList;
