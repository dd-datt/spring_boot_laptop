package org.example.laptopstore.repository;

import org.example.laptopstore.entity.Province;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProvinceRepository extends JpaRepository<Province, Integer> {

    List<Province> findAllByOrderByNameAsc();
}
