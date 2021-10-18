import React, { Component } from "react";

class FormAndPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      kyc:'',
      fullname: "",
      email: "",
    };
  }

  componentDidMount = async () => {
    await this.props.setMintBtnTimer();
  };

  callMintMyNFTFromApp = (e) => {
    e.preventDefault();
    this.props.mintMyNFT(      
      this.state.fullname,
      this.state.email,
      this.state.kyc
    );
  };
  onFileChange = event => {
    
    // Update the state
    this.setState({ kyc: event.target.files[0] });
  
  };
  render() {
    return (
      <div>
        <div className="card mt-1">
          <div className="card-body align-items-center d-flex justify-content-center">
            <h5>Create your Mint</h5>
          </div>
        </div>
        <form onSubmit={this.callMintMyNFTFromApp} className="pt-4 mt-1">
          <div className="row justify-content-center">
            <div className="col-md-6 d-flex justify-content-center align-items-center">
              <input type="file"
              onChange={this.onFileChange}/>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="fullname">Full Name</label>
                <input
                  required
                  type="text"
                  value={this.state.fullname}
                  className="form-control"
                  placeholder="Enter Your Full Name"
                  onChange={(e) =>
                    this.setState({ fullname: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  required
                  type="email"
                  name="email"
                  id="email"
                  value={this.state.email}
                  className="form-control"
                  placeholder="Email"
                  onChange={(e) =>
                    this.setState({ email: e.target.value })
                  }
                />
              </div>
              <button
                id="mintBtn"
                style={{ fontSize: "0.9rem", letterSpacing: "0.14rem" }}
                type="submit"
                className="btn mt-4 btn-block btn-outline-primary"
              >
                Mint
              </button>
              <div className="mt-4">
                {this.props.nameIsUsed ? (
                  <div className="alert alert-danger alert-dissmissible">
                    <button
                      type="button"
                      className="close"
                      data-dismiss="alert"
                    >
                      <span>&times;</span>
                    </button>
                    <strong>This name is taken!</strong>
                  </div>
                ) : this.props.colorIsUsed ? (
                  <>
                    <div className="alert alert-danger alert-dissmissible">
                      <button
                        type="button"
                        className="close"
                        data-dismiss="alert"
                      >
                        <span>&times;</span>
                      </button>
                      {this.props.colorsUsed.length > 1 ? (
                        <strong>These colors are taken!</strong>
                      ) : (
                        <strong>This color is taken!</strong>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        marginTop: "1rem",
                        marginBottom: "3rem",
                      }}
                    >
                      {this.props.colorsUsed.map((color, index) => (
                        <div
                          key={index}
                          style={{
                            background: `${color}`,
                            width: "50%",
                            height: "50px",
                          }}
                        ></div>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default FormAndPreview;
