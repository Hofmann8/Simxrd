import React from 'react';
import { FaGithub, FaEnvelope, FaUniversity } from 'react-icons/fa';

const About = () => {
  return (
    <div className="about-page" style={{height: 'calc(100vh - 8px)'}}>
      <div className="container-fluid h-100">
        <div className="row h-100">
          <div className="col-12 h-100">
            <div className="card h-100">
              <div className="card-header bg-primary text-white">
                <h5 className="card-title mb-0">关于 SimXRD</h5>
              </div>
              <div className="card-body" style={{ overflowY: 'auto' }}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-4">
                      <h4 className="text-primary mb-3">项目介绍</h4>
                      <p>
                        SimXRD 是一款专为材料科学研究人员设计的X射线衍射模拟工具，
                        旨在帮助研究人员快速预测和分析晶体结构的衍射特性。
                      </p>
                      <p>
                        本软件集成了晶体结构可视化、XRD模拟和数据分析等功能，
                        为沸石材料的研究提供了便捷的工具支持。
                      </p>
                      <div className="alert alert-warning mt-3">
                        <strong>注意：</strong> 本软件中的数据仅供本科生教学参考，模拟精度不适用于为实际科研作指导。
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-4">
                      <h4 className="text-primary mb-3">开发团队</h4>
                      <div className="card mb-3">
                        <div className="card-body">
                          <div className="d-flex align-items-center mb-3">
                            <div className="bg-light rounded-circle p-3 me-3">
                              <FaUniversity className="text-primary" size={24} />
                            </div>
                            <div>
                              <h5 className="mb-1">大连理工大学</h5>
                              <p className="text-muted mb-0">化学学院</p>
                            </div>
                          </div>
                          <p className="small">
                            本项目由大连理工大学化学学院研究团队开发，
                            旨在为沸石材料研究提供便捷的计算和分析工具。
                          </p>
                          <a 
                            href="https://zdysc.dlut.edu.cn/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary mt-2"
                          >
                            访问学院网站
                          </a>
                        </div>
                      </div>

                      <h4 className="text-primary mb-3">联系方式</h4>
                      <div className="list-group">
                        <a href="mailto:Alexphant@mail.dlut.edu.cn" className="list-group-item list-group-item-action d-flex align-items-center">
                          <FaEnvelope className="me-3 text-primary" />
                          <div>
                            <strong>林凯</strong>
                            <div className="small text-muted">Alexphant@mail.dlut.edu.cn</div>
                          </div>
                        </a>
                        <a href="https://github.com/Hofmann8/Simxrd" target="_blank" rel="noopener noreferrer" className="list-group-item list-group-item-action d-flex align-items-center">
                          <FaGithub className="me-3 text-primary" />
                          <div>
                            <strong>GitHub</strong>
                            <div className="small text-muted">github.com/Hofmann8/Simxrd</div>
                          </div>
                        </a>
                      </div>
                    </div>

                    <div className="alert alert-info mt-4">
                      <h5 className="alert-heading">版权声明</h5>
                      <p className="mb-0">
                        © 2024 大连理工大学化学学院。保留所有权利。
                        本软件遵循 MIT 许可证开源。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
